'use client';

import React, { Component } from 'react';
import GlobalError from './global-error';

export default class ErrorWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error('Error caught by ErrorWrapper:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <GlobalError error={this.state.error} reset={this.resetError} />;
    }

    return this.props.children;
  }
}
