import React, { useState, useRef } from 'react';

const Scroll: React.FC = () => {
  const data: number[] = [];
  for (let i = 0; i < 100; i++) {
    data.push(i);
  }
  const itemHeight = 50;
  const containerHeight = 300;

  const [contentTranslateDistance, setContentTranslateDistance] = useState(0);
  const [tempDS, setTempDS] = useState(data);
  const containerNode = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerNode.current) {
      const { scrollTop } = containerNode.current;
      const index = scrollTop / itemHeight;
      setTempDS(data.slice(index, index + 1 + containerHeight / itemHeight));

      setContentTranslateDistance(scrollTop - (scrollTop % itemHeight));
    }
  };

  return (
    <div
      className="container"
      style={{ height: `${containerHeight}px` }}
      ref={containerNode}
      onScroll={handleScroll}
    >
      {/* 设置空滚动区的高度为所有行高度之和，用以显示符合数据量大小的滚动条 */}
      <div
        className="scroll"
        style={{ height: `${itemHeight * data.length}px` }}
      ></div>
      {/* translateY用来控制真实的渲染区域跟随根元素container的滚动进行偏移，
      从而保持渲染区相对于视口的相对静止 */}
      <div style={{ transform: `translateY(${contentTranslateDistance}px)` }}>
        {tempDS &&
          tempDS.map(val => {
            return (
              <div className="test-item" style={{ height: `${itemHeight}px` }}>
                {val}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Scroll;
