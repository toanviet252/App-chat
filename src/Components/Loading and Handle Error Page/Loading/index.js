import './index.scss';

const Loading = ({ height }) => {
  return (
    <div
      className="loading-wapper"
      style={{
        minHeight: height ?? 'unset',
        height: height ?? 'unset',
      }}
    >
      <div className="loader">
        {Array(12)
          .fill(true)
          .map((_, index) => {
            // eslint-disable-next-line
            return <div className={`bar${index + 1}`} key={index} />;
          })}
      </div>
    </div>
  );
};
export default Loading;
