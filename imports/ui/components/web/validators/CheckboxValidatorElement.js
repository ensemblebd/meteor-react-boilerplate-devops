import React from 'react';
import { red300 } from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
import { ValidatorComponent } from 'react-form-validator-core';

class CheckboxValidatorElement extends ValidatorComponent {

    render() {
        const { errorMessages, validators, requiredError, value, ...rest } = this.props;

        return (
            <div>
                <Checkbox
                    {...rest}
                    ref={(r) => { this.input = r; }}
                />
                {this.errorText()}
            </div>
        );
    }

    errorText() {
        const { isValid } = this.state;

        if (isValid) {
            return null;
        }

        const style = {
            right: 0,
            fontSize: '12px',
            color: red300,
            position: 'absolute',
            marginTop: '-25px',
        };

        return (
            <div style={style}>
                {this.getErrorMessage()}
            </div>
        );
    }
}

export default CheckboxValidatorElement;