'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../../lib/api';
import PageWrapper from '../../../../components/layout/PageWrapper';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Swal from 'sweetalert2';

export default function NewCoursePage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        console.log(title, description);
        try {
            const res = await fetchApi('/api/courses', {
                method: 'POST',
                body: JSON.stringify({ data: { title, description } }),
            });
            
            // router.push(`/courses/${res.data.id}/edit`);
        } catch (err: any) {
            setError(err.message || 'Failed to create course.');
        } finally{
            Swal.fire({
                title: "Good job!",
                text: "Course Created Successfully!",
                icon: "success"
            }).then(() => {
                router.push('/courses');
            })
        }
    };

    return (
        <PageWrapper>
            <h1 className="text-3xl font-bold mb-6">Create a New Course</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <Input
                    id="title"
                    label="Course Title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
                        Course Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        className="w-full p-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                        required
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit">Create and Edit Course</Button>
            </form>
        </PageWrapper>
    );
}