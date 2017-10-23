'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const validIssueStatus = {
  New: true,
  Open: true,
  Assigned: true,
  Fixed: true,
  Verified: true,
  Closed: true
};

const issueFieldType = {
  status: 'required',
  owner: 'required',
  effort: 'optional',
  created: 'required',
  completionDate: 'optional',
  title: 'required'
};

// we'll see what the point of this 'cleanup' is
function cleanUpIssue(issue) {
  const cleanedUpIssue = {};
  Object.keys(issue).forEach(field => {
    if (issueFieldType[field]) {
      cleanedUpIssue[field] = issue[field];
    }
  });

  return cleanedUpIssue;
}

function validateIssue(issue) {
  const errors = [];
  Object.keys(issueFieldType).forEach(field => {
    //errors.push(`Missing mandatory field ${field}`);
    console.log("field: " + field + " " + "issue: " + issue[field]);
    if (issueFieldType === 'required' && !issue[field]) {
      errors.push(`Missing mandatory field ${field}`);
      console.log("Something happening?");
    }
  });

  if (!validIssueStatus[issue.status]) {
    errors.push(`${issue.status} is not a valid status.`);
  }

  return errors.length ? errors.join('; ') : null;
}

exports.default = {
  validateIssue: validateIssue,
  cleanUpIssue: cleanUpIssue
};
//# sourceMappingURL=issue.js.map