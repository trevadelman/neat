"use client";

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // For Ant Design styles
  const [cache] = useState(() => createCache());

  // For styled-components
  const [styledComponentsSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    // Extract styles for Ant Design
    const antStyles = extractStyle(cache);
    
    // Extract styles for styled-components
    const styledComponentsStyles = styledComponentsSheet.getStyleElement();
    
    // Clear styled-components sheet
    styledComponentsSheet.instance.clearTag();
    
    return (
      <>
        <style id="antd" dangerouslySetInnerHTML={{ __html: antStyles }} />
        {styledComponentsStyles}
      </>
    );
  });

  return (
    <StyleProvider cache={cache}>
      <StyleSheetManager sheet={styledComponentsSheet.instance}>
        {children}
      </StyleSheetManager>
    </StyleProvider>
  );
}
