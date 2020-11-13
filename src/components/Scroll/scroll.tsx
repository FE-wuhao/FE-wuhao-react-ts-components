import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';

interface IProps<T> {
  dataSource: T[];
  height?: number;
  itemHeight?: number;
}

function Scroll<T>(props: IProps<T>) {
  const { dataSource: ds, height = 600, itemHeight: itmHt = 50 } = props;
  // 行高
  const itemHeight = useMemo(() => itmHt, [itmHt]);
  // 完整表格数据
  const dataSource = useMemo(() => ds, [ds]);
  // 一栏渲染内容所对应的数据行数目
  const onePageItemNum = useMemo(() => height / itemHeight, [
    height,
    itemHeight,
  ]);
  // 渲染内容在Y轴上实时的translate距离
  const [contentTranslateDistance, setContentTranslateDistance] = useState(0);
  // 需要渲染出来的部分表格内容
  const [renderDataSource, setRenderDataSource] = useState(
    [...dataSource].slice(0, onePageItemNum)
  );
  // 容器节点
  const containerNode = useRef<HTMLDivElement>(null);
  // 计算出当前渲染框应该平移的距离以及渲染数组的起始索引值
  const getCurrentScrollTopAndStartIndex = useCallback(() => {
    if (containerNode.current) {
      const { scrollTop } = containerNode.current;
      const index = scrollTop / itemHeight;
      return {
        scrollTop,
        index,
      };
    }
    return {
      scrollTop: 0,
      index: 0,
    };
  }, [itemHeight]);
  // 容器滚动时间处理函数
  const handleScroll = () => {
    const { scrollTop, index } = getCurrentScrollTopAndStartIndex();

    setRenderDataSource(
      [...dataSource].slice(index, index + 1 + onePageItemNum)
    );
    setContentTranslateDistance(scrollTop - (scrollTop % itemHeight));
  };
  // 监听datasouce的变化更新渲染数组
  useEffect(() => {
    const { index } = getCurrentScrollTopAndStartIndex();
    setRenderDataSource(
      [...dataSource].slice(index, index + 1 + onePageItemNum)
    );
  }, [dataSource, getCurrentScrollTopAndStartIndex, onePageItemNum]);

  return (
    <div
      className="container"
      style={{ height: `${height}px` }}
      ref={containerNode}
      onScroll={handleScroll}
    >
      {/* 设置空滚动区的高度为所有行高度之和，用以显示符合数据量大小的滚动条 */}
      <div
        className="scroll"
        style={{ height: `${itemHeight * dataSource.length}px` }}
      ></div>
      {/* translateY用来控制真实的渲染区域跟随根元素container的滚动进行偏移，
      从而保持渲染区相对于视口的相对静止 */}
      <div style={{ transform: `translateY(${contentTranslateDistance}px)` }}>
        {renderDataSource &&
          renderDataSource.map((val, index) => {
            return (
              <div style={{ height: `${itemHeight}px` }} key={index}>
                {val}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Scroll;
