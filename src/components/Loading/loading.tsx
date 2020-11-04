import React from 'react';
import classnames from 'classnames';

export type TLoadingSize = 'sm' | 'md' | 'lg';

export interface ILoading {
  display: boolean;
  size?: TLoadingSize;
  innerMode?: boolean;
}

function Loading(props: ILoading) {
  const { display, size = 'small', innerMode = false } = props;

  const loadingClassName = classnames('loading-container', {
    [`loading-size-${size}`]: size,
  });

  const loadingCover = classnames('loading-cover', {
    'loading-cover-position-absolute': innerMode,
    'loading-cover-position-fixed': !innerMode,
  });

  return display ? (
    <div className={loadingCover}>
      <div className={loadingClassName}>
        <svg viewBox="0 0 20 20" className="loading">
          <circle cx="10" cy="10" r="9" className="circle" fill="none" />
        </svg>
      </div>
    </div>
  ) : null;
}

export default Loading;
