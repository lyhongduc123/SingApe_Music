import { Spinner, Box } from '@/components/ui';

interface LoadingOverlayProps {
  isUnder?: boolean;
}

export const LoadingOverlay = (props: LoadingOverlayProps) => {
  return (
    <Box className={`absolute ${props.isUnder ? '' : 'z-50'} w-full h-full flex items-center justify-center bg-background-0`}>
      <Spinner size="large" className='color-primary-500'/>
    </Box>
  );
};