let verifyArray = (array) =>
{
    let verification;
    if (array.length < 1) verification = false;
    else verification = true;

    return verification;
}

let dateStrComp = (post_date, searchDate) =>
{
    let pDate = new Date(post_date);
    let sDate = new Date(searchDate);
    return (pDate >= sDate);
}

exports.verifyArray = verifyArray;
exports.dateStrComp = dateStrComp;