
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cropper from 'react-easy-crop'
import { supabase } from './supabase.js'
import './EmployeePhotos.css'

const photoSlots = [
    {
        id: 'facility',
        title: 'Facility Banner',
        description: 'Main photo across the top of the homepage.',
        count: 1,
        aspect: 16 / 5,
    },
    {
        id: 'pantry',
        title: 'Food Pantry Slideshow',
        description: 'Photos shown in the Food Pantry section.',
        count: 3,
        aspect: 4 / 3,
    },
    {
        id: 'baby',
        title: 'Baby & Toddler Slideshow',
        description: 'Photos shown in the Baby & Toddler section.',
        count: 3,
        aspect: 4 / 3,
    },
    {
        id: 'sister-rachel',
        title: 'Sister Rachel Portrait',
        description: 'Portrait shown in the About Us section.',
        count: 1,
        aspect: 3 / 4,
    },
]

const BUCKET = 'site-photos'
const MAX_FILE_SIZE = 5 * 1024 * 1024

function slotPath(slot, index) {
    return `${slot.id}/${index + 1}.jpg`
}

function createCroppedImage(imageSrc, cropPixels) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = cropPixels.width
            canvas.height = cropPixels.height

            const context = canvas.getContext('2d')
            if (!context) {
                reject(new Error('Could not prepare the cropped image.'))
                return
            }

            context.drawImage(
                image,
                cropPixels.x,
                cropPixels.y,
                cropPixels.width,
                cropPixels.height,
                0,
                0,
                cropPixels.width,
                cropPixels.height,
            )

            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob)
                    else reject(new Error('Could not create the cropped image.'))
                },
                'image/jpeg',
                0.9,
            )
        }

        image.onerror = () => reject(new Error('Could not read this image.'))
        image.src = imageSrc
    })
}

export default function EmployeePhotos() {
    const navigate = useNavigate()
    const [checking, setChecking] = useState(true)
    const [signedIn, setSignedIn] = useState(false)
    const [message, setMessage] = useState('')
    const [savedPhotos, setSavedPhotos] = useState({})
    const [editing, setEditing] = useState(null)
    const [imageSrc, setImageSrc] = useState('')
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        let active = true

        supabase.auth.getSession().then(({ data, error }) => {
            if (!active) return

            if (error || !data.session) {
                navigate('/employee', { replace: true })
            } else {
                setSignedIn(true)
            }

            setChecking(false)
        })

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!session) navigate('/employee', { replace: true })
            },
        )

        return () => {
            active = false
            listener.subscription.unsubscribe()
        }
    }, [navigate])

    useEffect(() => {
        let active = true

        async function loadPhotos() {
            const entries = await Promise.all(
                photoSlots.flatMap((slot) =>
                    Array.from({ length: slot.count }, async (_, index) => {
                        const path = slotPath(slot, index)
                        const { data } = await supabase.storage
                            .from(BUCKET)
                            .createSignedUrl(path, 3600)

                        return [path, data?.signedUrl || '']
                    }),
                ),
            )

            if (active) {
                setSavedPhotos(Object.fromEntries(entries))
            }
        }

        if (signedIn) loadPhotos()

        return () => {
            active = false
        }
    }, [signedIn])

    async function handleSignOut() {
        await supabase.auth.signOut()
        navigate('/employee', { replace: true })
    }

    function closeEditor() {
        if (imageSrc) URL.revokeObjectURL(imageSrc)
        setImageSrc('')
        setEditing(null)
        setCroppedAreaPixels(null)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
    }

    function handleChoosePhoto(event, slot, index) {
        const file = event.target.files?.[0]
        event.target.value = ''

        if (!file) return

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setMessage('Please choose a JPG, PNG, or WebP image.')
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            setMessage('Please choose an image smaller than 5 MB.')
            return
        }

        if (imageSrc) URL.revokeObjectURL(imageSrc)
        setMessage('')
        setEditing({ slot, index })
        setImageSrc(URL.createObjectURL(file))
        setCrop({ x: 0, y: 0 })
        setZoom(1)
    }

    async function handleSavePhoto() {
        if (!editing || !imageSrc || !croppedAreaPixels) {
            setMessage('Choose and position a photo before saving.')
            return
        }

        setIsSaving(true)
        setMessage('')

        try {
            const blob = await createCroppedImage(imageSrc, croppedAreaPixels)
            const path = slotPath(editing.slot, editing.index)

            const { error } = await supabase.storage
                .from(BUCKET)
                .upload(path, blob, {
                    contentType: 'image/jpeg',
                    upsert: true,
                    cacheControl: '0',
                })

            if (error) throw error

            const { data, error: urlError } = await supabase.storage
                .from(BUCKET)
                .createSignedUrl(path, 3600)

            if (urlError) throw urlError

            setSavedPhotos((previous) => ({
                ...previous,
                [path]: data.signedUrl,
            }))
            setMessage(`${editing.slot.title} photo saved successfully.`)
            closeEditor()
        } catch (error) {
            console.error('Photo save error:', error)
            setMessage(
                error.message ||
                'Unable to save the photo. Check the storage permissions.',
            )
        } finally {
            setIsSaving(false)
        }
    }

    if (checking) {
        return <main className="employee-photos-page">Checking sign-in…</main>
    }

    if (!signedIn) return null

    async function handleSignOut() {
        await supabase.auth.signOut()
        navigate('/employee', { replace: true })
    }
    async function handleRemovePhoto(slot, index) {
        const confirmed = window.confirm(
            `Are you sure you want to remove the photo for "${slot.title}${slot.count > 1 ? ` ${index + 1}` : ''
            }"? This cannot be undone.`,
        )

        if (!confirmed) return

        const path = slotPath(slot, index)
        setMessage('')

        const { error } = await supabase.storage
            .from(BUCKET)
            .remove([path])

        if (error) {
            console.error('Photo removal error:', error)
            setMessage(`Unable to remove the photo: ${error.message}`)
            return
        }

        setSavedPhotos((previous) => ({
            ...previous,
            [path]: '',
        }))

        setMessage(`${slot.title} photo removed successfully.`)
    }
    return (
        <main className="employee-photos-page">
            <header className="employee-photos-header">
                <img src="/st-ursula-logo.png" alt="" />
                <div>
                    <p className="employee-photos-eyebrow">STAFF ACCESS</p>
                    <h1>Website Photo Manager</h1>
                    <p>Manage the photos displayed on the St. Ursula website.</p>
                </div>
                <button onClick={handleSignOut} className="employee-signout">
                    Sign Out
                </button>
            </header>

            {message && <p role="status">{message}</p>}

            <section className="employee-photo-groups">
                {photoSlots.map((slot) => (
                    <section className="employee-photo-group" key={slot.id}>
                        <h2>{slot.title}</h2>
                        <p>{slot.description}</p>

                        <div className="employee-photo-slots">
                            {Array.from({ length: slot.count }, (_, index) => {
                                const path = slotPath(slot, index)
                                const photoUrl = savedPhotos[path]

                                return (
                                    <div className="employee-photo-slot" key={path}>
                                        <h3>
                                            {slot.count > 1
                                                ? `Photo ${index + 1}`
                                                : slot.title}
                                        </h3>

                                        {photoUrl ? (
                                            <img
                                                src={photoUrl}
                                                alt={`${slot.title} ${index + 1}`}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    aspectRatio: String(slot.aspect),
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="employee-photo-placeholder"
                                                style={{
                                                    aspectRatio: String(slot.aspect),
                                                }}
                                            >
                                                No photo uploaded
                                            </div>
                                        )}

                                        <div style={{ marginTop: '12px' }}>
                                            <label className="photo-upload-button">
                                                {photoUrl ? 'Replace Photo' : 'Choose Photo'}
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={(event) =>
                                                        handleChoosePhoto(event, slot, index)
                                                    }
                                                    style={{ display: 'none' }}
                                                />
                                            </label>

                                            {photoUrl && (
                                                <button
                                                    type="button"
                                                    className="remove-photo-button"
                                                    onClick={() =>
                                                        handleRemovePhoto(slot, index)
                                                    }
                                                >
                                                    Remove Photo
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                ))}
            </section>


            {editing && imageSrc && (
                <div
                    className="photo-editor-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !isSaving) {
                            closeEditor()
                        }
                    }}
                >
                    <section
                        className="photo-editor photo-editor-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="photo-editor-title"
                    >
                        <button
                            type="button"
                            className="photo-editor-close"
                            onClick={closeEditor}
                            disabled={isSaving}
                            aria-label="Close photo editor"
                        >
                            ×
                        </button>

                        <h2 id="photo-editor-title">
                            Preview and Crop: {editing.slot.title}
                        </h2>
                        <p>Move the photo to position it. Use the slider to zoom.</p>

                        <div className="photo-editor-crop-area">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={editing.slot.aspect}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, pixels) =>
                                    setCroppedAreaPixels(pixels)
                                }
                            />
                        </div>

                        <label className="photo-editor-zoom">
                            Zoom
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(event) =>
                                    setZoom(Number(event.target.value))
                                }
                            />
                        </label>

                        <div className="photo-editor-actions">
                            <button
                                type="button"
                                onClick={closeEditor}
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSavePhoto}
                                disabled={isSaving || !croppedAreaPixels}
                            >
                                {isSaving ? 'Saving…' : 'Crop and Save Photo'}
                            </button>
                        </div>
                    </section>
                </div>
            )}


            <a className="employee-photos-back" href="/">
                ← Back to the public website
            </a>
        </main>
    )
}
