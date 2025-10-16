'use client';

import { IconAlertCircle } from '@tabler/icons-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function AreaStatsError({ error }: { error: Error }) {
  return (
    <Alert variant='destructive'>
      <IconAlertCircle className='h-4 w-4' />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load area statistics: {error.message}
      </AlertDescription>
    </Alert>
  );
}
