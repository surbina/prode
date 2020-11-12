import * as React from 'react';
import PropTypes from 'prop-types';

function MatchItem({ matchAddress }) {
  return <div>This will be the match: {matchAddress}</div>;
}

MatchItem.propTypes = {
  matchAddress: PropTypes.string.isRequired,
};

export default MatchItem;
