import React from 'react';
import { Accounts, STATES } from 'meteor/std:accounts-ui';

function Account() {
  return (
    <div className='Account'>
        <h3>YOUR ACCOUNT</h3>
        <Accounts.ui.LoginForm formState={STATES.PROFILE} />
    </div>
  );
}

export class CAccount extends React.Component {
    render() {
        return (
            <Account />
        );
    }
}

export default CAccount;
