export function phone(params = {}) {
  const { areacode = true, extension = false } = params;
  let number = this.randexp(/[2-9][0-9]{6,7}/)();
  if (areacode) {
    number = this.randexp(/0[0-9]{2,3}\-/)() + number;
  }
  if (extension) {
    number += this.randexp(/\-[0-9]{1,4}/)();
  }
  return number;
}
