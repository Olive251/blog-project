let verifyArray = (array) =>
{
    let verification;
    if (array.length < 1) verification = false;
    else verification = true;

    return verification;
}

let dateStrComp = (postDate, searchDate) =>
{
    let pDate = new Date(postDate);
    let sDate = new Date(searchDate);
    return (pDate >= sDate);
}

exports.verifyArray = verifyArray;
exports.dateStrComp = dateStrComp;