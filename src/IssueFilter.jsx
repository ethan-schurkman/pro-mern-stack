import React from 'react';
// import { Link } from 'react-router';

export default class IssueFilter extends React.Component { // eslint-disable-line
  constructor() {
    super();
    this.clearFilter = this.clearFilter.bind(this);
    this.setFilterOpen = this.setFilterOpen.bind(this);
    this.setFilterAssigned = this.setFilterAssigned.bind(this);
    // this.setFilterNew = this.setFilterNew.bind(this);
  }

  setFilterOpen(e) {
    e.preventDefault();
    this.props.setFilter({ status: 'Open' });
  }

  setFilterAssigned(e) {
    e.preventDefault();
    this.props.setFilter({ status: 'Assigned' });
  }

  /* setFilterNew(e) {
    e.preventDefault();
    this.props.setFilter({ status: 'New' });
  } */
  clearFilter(e) {
    e.preventDefault();
    this.props.setFilter({});
  }

  render() {
    const Separator = () => <span> | </span>;
    return (
      <div>
        <a href="#" onClick={this.clearFilter}>All Issues</a>
        <Separator />
        <a href="#" onClick={this.setFilterOpen}>Open Issues</a>
        <Separator />
        <a href="#" onClick={this.setFilterAssigned}>Assigned Issues</a>
        { /* <Separator />
        <a href="#" onClick={this.setFilterNew}>New Issues</a> */ }
      </div>
    );
  }
}

IssueFilter.propTypes = {
  setFilter: React.PropTypes.func.isRequired,
};
