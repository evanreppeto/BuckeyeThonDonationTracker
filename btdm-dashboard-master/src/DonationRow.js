const curseWords = [];

function containsBadWord(message) {
    let words = message.toLowerCase().split(" ");
    return words.some(word => curseWords.includes(word));
}

function DonationRow(props) {
    return (
        <tr>
            <td>
                <img height={75} width={75} src={props.donation && props.donation.avatarImageURL} alt="Avatar" />
            </td>
            <td>
                {props.donation && props.donation.recipientName}
            </td>
            <td>
                {props.donation && (props.donation.displayName ? props.donation.displayName : "Anonymous")}
            </td>
            <td>
                {props.donation && props.donation.amount ? `$${props.donation.amount.toFixed(2)}` : 'N/A'}
            </td>
            <td>
                {props.donation && props.donation.message ? (
                    containsBadWord(props.donation.message) ?
                        "⚠️ Watch your language! ⚠️" : props.donation.message)
                    : "No message!"}
            </td>
        </tr>
    );
}

export default DonationRow;