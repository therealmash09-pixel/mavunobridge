/* MAVUNOBRIDGE — OPTIONAL BUYER CHECKLIST */

window.MAVUNO_BUYER_GUIDE = {
  checkListing(listing) {
    const checks = [];

    if (!listing?.name) checks.push("Ask for the exact product name.");
    if (!listing?.county) checks.push("Confirm the county and collection point.");
    if (!listing?.price) checks.push("Confirm the final price and unit.");
    if (!listing?.quantity) checks.push("Confirm available quantity before travelling.");
    if (!listing?.condition) checks.push("Ask to inspect the product condition.");
    if (!listing?.phone) checks.push("Ask the seller for a contact method.");

    if (!checks.length) {
      checks.push(
        "Confirm stock, quality, final price, transport and payment terms before making the deal."
      );
    }

    return checks;
  }
};
