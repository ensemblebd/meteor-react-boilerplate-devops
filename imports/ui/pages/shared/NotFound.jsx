import React from 'react';

function NotFound() {
  return (
    <div className='NotFound'>
      <h1>Content not found</h1>
    </div>
  );
}

export class CNotFound extends React.Component {
    render() {
        return (
            <NotFound />
        );
    }
}
export default CNotFound;
