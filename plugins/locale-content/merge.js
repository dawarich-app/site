function sameKind(a, b) {
  return Array.isArray(a) === Array.isArray(b) && typeof a === typeof b && (a === null) === (b === null);
}

function mergeOverEnglish(english, localized) {
  if (localized === undefined || !sameKind(english, localized)) return english;
  if (Array.isArray(english)) return english.map((item, index) => mergeOverEnglish(item, localized[index]));
  if (english && typeof english === 'object') {
    return Object.fromEntries(Object.entries(english).map(([key, value]) => [key, mergeOverEnglish(value, localized[key])]));
  }
  return localized;
}

module.exports = { mergeOverEnglish };
