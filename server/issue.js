
const validIssueStatus = {
	New: true,
	Open: true,
	Assigned: true,
	Fixed: true,
	Verified: true,
	Closed: true,
};

const issueFieldType = {
	status: 'required',
	owner: 'required',
	effort: 'optional',
	created: 'required',
	completionDate: 'optional',
	title: 'required',
};

function validateIssue(issue) {
	for (var field in issueFieldType) { // <-- in textbook use keyword const. Interestingly doesn't seem to iterate on for-in loop.
		var type = issueFieldType[field]; // <-- Looks like const are read only vars. Not immutable but cannot reallocate const twice.
		if (!type) {
			delete issue[field];
		} else if (type === 'required' && !issue[field]) {
			return `${field} is required`;
		}
	}

	if(!validIssueStatus[issue.status]) {
		return `${issue.status} is not a valid status.`;
	}

	return null;
}

export default {
	validateIssue: validateIssue
};