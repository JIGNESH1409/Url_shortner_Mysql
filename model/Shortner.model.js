// import { db } from "../config/db.client.js";

// export const LoadFile = async () => {
//     const [rows] = await db.execute(
//         "SELECT shorturl, url FROM url_short_link ORDER BY id DESC"
//     );
//     return rows;
// };

// export const loadLinks = async ({ url, finalshort }) => {
//     await db.execute(
//         "INSERT INTO url_short_link (shorturl, url) VALUES (?, ?)",
//         [finalshort, url]
//     );
// };

// export const getLinkbyShorturl = async (shortcode) => {
//     const [rows] = await db.execute(
//         "SELECT shorturl, url FROM url_short_link WHERE shorturl = ? LIMIT 1",
//         [shortcode]
//     );
//     return rows.length ? rows[0] : null;
// };
