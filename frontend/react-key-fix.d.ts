import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      key?: React.Key | null;
    }
  }
}

export {};
