import React from "react";
import DonationRow from "./DonationRow";

function RecentDonations(props) {
    return props.donations && props.donations.length > 0 ? (
        <div>
            <table cellSpacing={20} className="tableBg">
                <colgroup>
                    <col span={1} style={{ width: "5%" }} />
                    <col span={1} style={{ width: "20%" }} />
                    <col span={1} style={{ width: "20%" }} />
                    <col span={1} style={{ width: "10%" }} />
                    <col span={1} style={{ width: "45%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th colSpan={2}>Team Member</th>
                        <th>Donor</th>
                        <th>Amount</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {props.donations.map(donation => (
                        <DonationRow key={donation.donationID} donation={donation} />
                    ))}
                </tbody>
            </table>
        </div>
    ) : (
        <></>
    );
}

export default RecentDonations;