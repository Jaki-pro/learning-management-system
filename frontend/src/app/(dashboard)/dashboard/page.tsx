import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';

const Page = () => {
    return (
        <PageWrapper>
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
                <h1 className="  font-bold text-red-500 ">Welcome to Aura LMS</h1>
                <p className="mt-4 text-lg">Your learning journey starts here.</p>
                <div className="card mt-6 p-4 bg-muted rounded-lg shadow-md w-48 h-48 p-[20px]">
                    <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
                    <p className="text-base">Access your courses, track progress, and manage your profile.</p>
                </div>
            </div>
        </PageWrapper>
    );
}

export default Page;