import React from 'react';

// TODO Convert Layout to stateless component.
export default React.createClass({ // eslint-disable-line react/prefer-es6-class
  propTypes: {
    view: React.PropTypes.func.isRequired, // React component constructor
    model: React.PropTypes.object.isRequired,
  },

  statics: {
    container: 'div',
  },

  getTitle() {
    return this.props.model.title || '';
  },

  getStyles() {
    return this.props.model.styles || [];
  },

  render() {
    return React.createElement(this.props.view, this.props.model);
  },
});
