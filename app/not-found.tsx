"use client";

import { Suspense } from "react";


export default function NotFound() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <div className="text-blue-950 flex flex-col justify-center items-center h-[70vh]">
        <h1 className="text-3xl font-bold">Oh no!</h1>
        <p className="mt-4">Sorry, the page you are looking for does not exist.</p>
      </div>
    </Suspense>
  );
}