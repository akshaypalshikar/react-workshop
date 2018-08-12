////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Using context, implement the <Form>, <SubmitButton>, and <TextInput>
// components such that:
//
// - Clicking the <SubmitButton> calls the form's `onSubmit` handler
// - Hitting "Enter" while in a <TextInput> submits the form
// - Don't use a <form> element, we're intentionally recreating the
//   browser's built-in behavior
//
// Got extra time?
//
// - Send the values of all the <TextInput>s to the form's `onSubmit` handler
//   without using DOM traversal APIs
// - Implement a <ResetButton> that resets the <TextInput>s in the form
////////////////////////////////////////////////////////////////////////////////
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { format } from "path";


const FormContext = React.createContext();

class Form extends React.PureComponent {
  state = {
    reset: false
  }


  componentDidMount() {
    this.setState({ reset: false });
  }

  componentDidUpdate() {
    this.setState({ reset: false });
  }


  resetMe = () => {
    this.setState({ reset: true });
  }

  renderClonedIfReset=()=>{
    if( this.state.reset){
      return React.Children.map(this.props.children,child=>(React.cloneElement(child,this.state)));
    }
    return this.props.children;
  }

  render() {
    return (<FormContext.Provider value={{
      submit: this.props.onSubmit,
      reset: this.resetMe
    }}
    >
    <div>{this.renderClonedIfReset()}</div>
    </FormContext.Provider>);
  }
}

class SubmitButton extends React.Component {
  render() {
    return (
      <FormContext.Consumer>
        {form => (
          <button onClick={form.submit}>Submit
          </button>
        )}
      </FormContext.Consumer>
    );
  }
}

class ResetButton extends React.Component {
  render() {
    return (
      <FormContext.Consumer>{
        form => (
          <button onClick={form.reset}>
            {this.props.children}
          </button>
        )
      }
      </FormContext.Consumer>
    );
  }

}

class TextInput extends React.Component {
  isEnterPressed = (input, form) => {
    if (input.key == 'Enter') {
      form.submit();
    }
  };

  render() {
    return (
      <FormContext.Consumer>
        {form => (
          this.props.reset?
          <input
            type="text"
            name={this.props.name}
            placeholder={this.props.placeholder}
            value=''
            onKeyDown={(input) => (this.isEnterPressed(input, form))}
          />:
          <input
            type="text"
            name={this.props.name}
            placeholder={this.props.placeholder}
            onKeyDown={(input) => (this.isEnterPressed(input, form))}
          />
        )
        }

      </FormContext.Consumer>
    );
  }
}

class App extends React.Component {
  handleSubmit = () => {
    alert("YOU WIN!");
  };

  render() {
    return (
      <div>
        <h1>
          This isn't even my final <code>&lt;Form/&gt;</code>!
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <p>
            First Name: <TextInput name="firstName" placeholder="First Name" /> <br/>
            Last Name: <TextInput name="lastName" placeholder="Last Name" />
          </p>
          <p>
            <SubmitButton>Submit</SubmitButton><br />
            <ResetButton>Reset</ResetButton>
          </p>
        </Form>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
