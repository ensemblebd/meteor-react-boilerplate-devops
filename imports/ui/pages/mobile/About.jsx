import React from 'react';

function About() {
  return (
    <div className='About'>
      <h1>About</h1>
        <p>About the app!?</p>
    </div>
  );
}

export class CAbout extends React.Component {
    render() {
        return (
            <About />
        );
    }
}

export default CAbout;
