function toBinary(id) {
    let binary = '';
    let high = parseInt(id.slice(0, -10)) || 0;
    let low = parseInt(id.slice(-10));
    while (low > 0 || high > 0) {
      binary = String(low & 1) + binary;
      low = Math.floor(low / 2);
      if (high > 0) {
        low += 5000000000 * (high % 2);
        high = Math.floor(high / 2);
      }
    }
  return binary;
};

function toTimestamp(id) {
  const binary =  toBinary(id).toString(2).padStart(64, '0');
  const Int = parseInt(binary.substring(0,42),2) + 1420070400000;
  return Int;
};

function formatImage() {
};



module.exports = {toBinary,toTimestamp};