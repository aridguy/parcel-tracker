// // src/utils/parcels.js

// export const PARCELS_URL = 'https://sheetdb.io/api/v1/hw2ce8n9rooe3';

// export const statusColors = {
//   delivered: '#22c55e',
//   out_for_delivery: '#FF5230',
//   in_transit: '#FF5230',
//   pending: '#a1a1aa',
//   exception: '#ef4444',
// };

// export const statusLabels = {
//   delivered: 'Delivered',
//   out_for_delivery: 'Out for delivery',
//   in_transit: 'In transit',
//   pending: 'Pending',
//   exception: 'Exception',
// };

// /**
//  * Normalize a raw SheetDB row into the shape our UI expects.
//  */
// export const normalizeParcelRow = (r) => {
//   const status = (r.status || 'pending').toLowerCase();
//   return {
//     number: r.tracking_number || '',
//     status,
//     label: statusLabels[status] || 'Pending',
//     courier: r.courier || '—',
//     from: r.from_location || '—',
//     to: r.to_location || '—',
//     eta: r.arrives_thru || '—',
//   };
// };