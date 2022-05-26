import moment from "moment";
/**
 * Fetch data from given url
 * @param {*} date
 */

const datePipe = (date) => {
    const userDetails = JSON.parse(localStorage.getItem('user-details'));

    return date ? moment(date).format(userDetails.Partner.dateFormat) : '-'

}

export { datePipe };
