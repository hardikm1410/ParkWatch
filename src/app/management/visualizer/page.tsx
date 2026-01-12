import { Suspense } from 'react';
import VisualizerClient from './VisualizerClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Visualizer...</div>}>
      <VisualizerClient />
    </Suspense>
  );
}