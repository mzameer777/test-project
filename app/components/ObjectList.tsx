'use client'

import { useState, useEffect } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"

interface ObjectItem {
  id: string
  title: string
  description: string
  fileName: string
  fileUrl: string
  uploadDate: string
}

export default function ObjectList() {
  const [objects, setObjects] = useState<ObjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchObjects = async () => {
    try {
      const response = await fetch('/api/objects')
      if (!response.ok) throw new Error('Failed to fetch objects')
      const data = await response.json()
      setObjects(data)
    } catch (err) {
      console.error('Error fetching objects:', err)
      setError('Error fetching objects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchObjects()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/objects/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete object')
      setObjects(objects.filter(obj => obj.id !== id))
    } catch (err) {
      console.error('Error deleting object:', err)
      setError('Error deleting object')
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (objects.length === 0) return <p>No objects found</p>

  return (
    <div className="space-y-4">
      {objects.map(obj => (
        <Card key={obj.id}>
          <CardHeader>
            <CardTitle>{obj.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">{obj.description}</p>
            <p className="text-sm">File: {obj.fileName}</p>
            <p className="text-sm">Uploaded: {new Date(obj.uploadDate).toLocaleString()}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <a href={obj.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(obj.id)}>Delete</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

