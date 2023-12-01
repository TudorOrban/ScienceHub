"use client";

import React from 'react';
import 'react-calendar-heatmap/dist/styles.css';

import D3Heatmap from './D3Heatmap';

export type ActivityData = {
    date: string;
    count: number;
    type: 'experiment' | 'datasetUpload';
};


interface ActivityContentProps {
    data: ActivityData[];
  }

function ActivityContent({ data }: ActivityContentProps) {
    return (
      <div className="m-20 w-100">
        <D3Heatmap data={data} />
        {/* ... any other components or content ... */}
      </div>
    );
  }
  
  export default ActivityContent;