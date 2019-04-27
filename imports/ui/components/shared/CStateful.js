import React from "react";


export class CStateful extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            toggle: this.props.toggle
        };
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }
    triggerChange(newval) {
        if (this.state.toggle!==newval) {
            this.setState({
                toggle: newval
            });
        }
    }
    render() {
        return (
            (this.state.toggle)?
                this.props.children
                :
                <div className={"empty"}> </div>
        );
    }
}
export class CStateful_H1 extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            text: this.props.text
        };
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }
    triggerChange(text) {
        this.setState({
            text: text
        });
    }
    render() {
        return (
            <h1 className={this.props.className}>
                {this.state.text}
            </h1>
        );
    }
}