import React from 'react'
import { cn } from '../libs/utils';

interface PageSkeletonProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    size?: 'sm'
    }


const PageSkeleton = ({children, title, subtitle, size}: PageSkeletonProps) => {
  return (
    <div className="flex flex-col justify-center items-center mt-20 mx-2">
    <div className={cn("bg-white shadow-2xl rounded-2xl sm:p-15 p-10 flex flex-col justify-center shadow-black/50 sm:max-w-4xl w-full",
    size === 'sm' ? 'sm:max-w-2xl' : ''
    )}>
      <h1 className="text-3xl font-bold text-blue-950 mb-6">
        {title}
      </h1>
      <p className="pb-20 text-gray-500 text-base">
        {subtitle}
      </p>
    {children}
    </div>
    </div>
  )
}

export default PageSkeleton