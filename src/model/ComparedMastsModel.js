export default class ComparedMastsModel {

  constructor(masts) {
    if(Array.isArray(masts))
      this.masts = masts;
    else
      this.masts = [];
  }

  add(mast) {
    return new ComparedMastsModel(
      this.masts.concat([mast])
    );
  }

  remove(mast) {
    return new ComparedMastsModel(
      this.masts.filter(m => m !== mast)
    );
  }

  removeAll() {
    return new ComparedMastsModel();
  }

  isCompared(mast) {
    return this.masts.includes(mast);
  }

  isAnyCompared() {
    return this.masts.length > 0;
  }

  getFirst() {
    return this.masts[0];
  }

  getProfile() {
    const first = this.getFirst();
    return first ? first.profile : undefined;
  }
}