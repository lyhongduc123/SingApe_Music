// components/theme/LightBox.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Box, HStack, VStack } from '../ui';

export const LightBox = () => {
  return (
    <VStack space="md" className="bg-white p-2 border rounded-t-xl w-full">
      <Box className="h-6 w-20 bg-gray-200 rounded-md" />

      <HStack space="sm">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className='h-5 w-5 bg-gray-300' />
        ))}
      </HStack>

      <VStack space="sm">
        {[...Array(2)].map((_, i) => (
          <HStack key={i} space="sm" className='items-center'>
            <Skeleton className='h-5 w-5 rounded-md bg-gray-300' />
            <VStack space="xs" className='flex-1'>
              <Box className="h-3 w-3/5 bg-gray-200 rounded-md" />
              <Box className="h-2 w-2/5 bg-gray-200 rounded-md" />
            </VStack>
            <Box className="h-3 w-3 bg-gray-300 rounded-full" />
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};
