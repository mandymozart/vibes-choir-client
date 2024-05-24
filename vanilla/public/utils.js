function getBpmFromMs(milliseconds) {
  return 60000 / milliseconds;
}

function getMsFromBpm(bpm) {
  return 60000 / bpm;
}

function msPerBeat(bpm, beats = 1) {
  return beats * getMsFromBpm(bpm);
}

// Example usage:
//   const minMilliseconds = 100; // Minimum milliseconds
//   const maxMilliseconds = 1000; // Maximum milliseconds
//   const frequency = 5; // Frequency in Hz
//   const milliseconds = millisecondsWithSinusLFO(minMilliseconds, maxMilliseconds, frequency);
//   console.log("Milliseconds:", milliseconds);
function millisecondsWithSinusLFO(minMilliseconds, maxMilliseconds, frequency) {
  const now = new Date().getTime();
  const period = 1000 / frequency;
  const phase = (now % period) / period;
  const sinValue = Math.sin(phase * 2 * Math.PI);
  const milliseconds =
    minMilliseconds +
    ((maxMilliseconds - minMilliseconds) * (sinValue + 1)) / 2;
  return milliseconds;
}

/* 
@param {string[]} values // possible values
@param {number[]} weights // weights
@returns {string}
*/
function randomByWeight(values, weights) {
  let total = 0;

  // Sum total of weights
  weights.forEach((weight) => {
    total += weight;
  });

  // Random a number between [1, total]
  const random = Math.ceil(Math.random() * total); // [1,total]

  // Seek cursor to find which area the random is in
  let cursor = 0;
  for (let i = 0; i < weights.length; i++) {
    cursor += weights[i];
    if (cursor >= random) {
      return values[i];
    }
  }
  return 'never go here';
}

function randomNumberOfRangeWithWeight(min, max, similarWeight) {
  const weight = Math.max(0, Math.min(1, similarWeight)); // Ensure weight is between 0 and 1
  const diff = max - min;
  const similarRange = diff * weight;
  const randomWithinSimilarRange = Math.floor(
    Math.random() * (similarRange + 1),
  );
  const randomOutsideSimilarRange = Math.floor(
    Math.random() * (diff - similarRange + 1),
  );
  const randomNumber =
    Math.random() < weight
      ? min + randomWithinSimilarRange
      : min + similarRange + randomOutsideSimilarRange;
  return randomNumber;
}

function weightedRand(weights) {
  const tolerance = 0.000001; // Tolerance value for floating-point precision
  const sum = Object.values(weights).reduce((acc, val) => acc + val, 0);
  if (Math.abs(sum - 1.0) > tolerance) {
    throw new Error('Probabilities must sum up to 1');
  }
  if (!Object.values(weights).every((p) => p >= 0)) {
    throw new Error('Probabilities must not be negative');
  }
  // Additional sanity checks can be added here as needed

  // Ignore elements with probability 0
  weights = Object.fromEntries(
    Object.entries(weights).filter(([k, v]) => v !== 0.0),
  );

  // Accumulate probabilities and map them to a value
  let u = 0.0;
  const ranges = Object.entries(weights).map(([v, p]) => [(u += p), v]);

  // Generate a (pseudo-)random floating point number between 0.0(included) and 1.0(excluded)
  u = Math.random();

  // Find the first value that has an accumulated probability greater than the random number u
  return ranges.find(([p, v]) => p > u)[1];
}

// Example usage:
//   const weights = { "a": 0.4, "b": 0.4, "c": 0.2 };
//   console.log(weightedRand(weights));

/*
https://gist.github.com/Liam0205/0b5786e9bfc73e75eb8180b5400cd1f8
*/
class WeightedList {
  constructor(listItems = [], rand = null) {
    this._list = [];
    this._weights = [];
    this._probabilities = [];
    this._alias = [];
    this._totalWeight = 0;
    this._areAllProbabilitiesIdentical = false;
    this._minWeight = 0;
    this._maxWeight = 0;
    this._rand = rand || new Random();

    listItems.forEach((item) => {
      this._list.push(item._item);
      this._weights.push(this.fixWeight(item._weight));
    });

    this.recalculate();
  }

  weightedRand() {
    if (this._list.length === 0) return null;
    let nextInt = this._rand.next(this._list.length);
    if (this._areAllProbabilitiesIdentical) return this._list[nextInt];
    let nextProbability = this._rand.next(this._totalWeight);
    return nextProbability < this._probabilities[nextInt]
      ? this._list[nextInt]
      : this._list[this._alias[nextInt]];
  }

  addWeightToAll(weight) {
    if (
      weight + this._minWeight <= 0 &&
      this.BadWeightErrorHandling === 'ThrowExceptionOnAdd'
    ) {
      throw new Error(
        `Subtracting ${
          -1 * weight
        } from all items would set weight to non-positive for at least one element.`,
      );
    }
    for (let i = 0; i < this._list.length; i++) {
      this._weights[i] = this.fixWeight(this._weights[i] + weight);
    }
    this.recalculate();
  }

  subtractWeightFromAll(weight) {
    this.addWeightToAll(weight * -1);
  }

  setWeightOfAll(weight) {
    if (weight <= 0 && this.BadWeightErrorHandling === 'ThrowExceptionOnAdd') {
      throw new Error('Weight cannot be non-positive.');
    }
    for (let i = 0; i < this._list.length; i++) {
      this._weights[i] = this.fixWeight(weight);
    }
    this.recalculate();
  }

  get totalWeight() {
    return this._totalWeight;
  }

  get minWeight() {
    return this._minWeight;
  }

  get maxWeight() {
    return this._maxWeight;
  }

  get items() {
    return this._list.slice();
  }

  *[Symbol.iterator]() {
    yield* this._list;
  }

  add(item, weight) {
    this._list.push(item);
    this._weights.push(this.fixWeight(weight));
    this.recalculate();
  }

  clear() {
    this._list = [];
    this._weights = [];
    this.recalculate();
  }

  contains(item) {
    return this._list.includes(item);
  }

  indexOf(item) {
    return this._list.indexOf(item);
  }

  remove(item) {
    let index = this.indexOf(item);
    this.removeAt(index);
    this.recalculate();
  }

  removeAt(index) {
    this._list.splice(index, 1);
    this._weights.splice(index, 1);
    this.recalculate();
  }

  setWeight(item, newWeight) {
    let index = this.indexOf(item);
    if (index !== -1) {
      this._weights[index] = this.fixWeight(newWeight);
      this.recalculate();
    }
  }

  getWeightOf(item) {
    let index = this.indexOf(item);
    if (index !== -1) {
      return this._weights[index];
    }
    return null;
  }

  toString() {
    let sb = [];
    sb.push(
      `WeightedList<${this._list[0].constructor.name}>: TotalWeight:${this.totalWeight}, Min:${this.minWeight}, Max:${this.maxWeight}, Count:${this._list.length}, {`,
    );
    for (let i = 0; i < this._list.length; i++) {
      sb.push(`${this._list[i].toString()}:${this._weights[i].toString()}`);
      if (i < this._list.length - 1) sb.push(', ');
    }
    sb.push('}');
    return sb.join('');
  }

  fixWeightSetToOne(weight) {
    return weight <= 0 ? 1 : weight;
  }

  fixWeightExceptionOnAdd(weight) {
    if (weight <= 0) {
      throw new Error('Weight cannot be non-positive.');
    }
    return weight;
  }

  fixWeight(weight) {
    return this.BadWeightErrorHandling === 'ThrowExceptionOnAdd'
      ? this.fixWeightExceptionOnAdd(weight)
      : this.fixWeightSetToOne(weight);
  }

  recalculate() {
    this._totalWeight = 0;
    this._areAllProbabilitiesIdentical = false;
    this._minWeight = 0;
    this._maxWeight = 0;
    let isFirst = true;

    this._alias = [];
    this._probabilities = [];

    let scaledProbabilityNumerator = [];
    let small = [];
    let large = [];
    this._weights.forEach((weight) => {
      if (isFirst) {
        this._minWeight = this._maxWeight = weight;
        isFirst = false;
      }
      this._minWeight = weight < this._minWeight ? weight : this._minWeight;
      this._maxWeight = this._maxWeight < weight ? weight : this._maxWeight;
      this._totalWeight += weight;
      scaledProbabilityNumerator.push(weight * this._list.length);
      this._alias.push(0);
      this._probabilities.push(0);
    });

    // Degenerate case, all probabilities are equal.
    if (this._minWeight === this._maxWeight) {
      this._areAllProbabilitiesIdentical = true;
      return;
    }

    for (let i = 0; i < this._list.length; i++) {
      if (scaledProbabilityNumerator[i] < this._totalWeight) {
        small.push(i);
      } else {
        large.push(i);
      }
    }

    while (small.length > 0 && large.length > 0) {
      let l = small.pop();
      let g = large.pop();
      this._probabilities[l] = scaledProbabilityNumerator[l];
      this._alias[l] = g;
      let tmp =
        scaledProbabilityNumerator[g] +
        scaledProbabilityNumerator[l] -
        this._totalWeight;
      scaledProbabilityNumerator[g] = tmp;
      if (tmp < this._totalWeight) {
        small.push(g);
      } else {
        large.push(g);
      }
    }

    while (large.length > 0) {
      let g = large.pop();
      this._probabilities[g] = this._totalWeight;
    }
  }
}

class WeightedListItem {
  constructor(item, weight) {
    this._item = item;
    this._weight = weight;
  }
}

const WeightErrorHandlingType = {
  SetWeightToOne: 'SetWeightToOne',
  ThrowExceptionOnAdd: 'ThrowExceptionOnAdd',
};

function preloadImage(url) {
  const img = new Image();
  img.src = url;
  return img;
}

function preloadMedia(media) {
  if (media.type === 'image') {
    const imageEl = new Image();
    imageEl.src = media.url;
  } else {
    // Handle other media types if needed
    console.warn('Can not preload media type:', media.type);
  }
}

function getEmojiForMediaType(mediaType) {
  if (mediaType === 'onomatopoeia') return '👄';
  if (mediaType === 'image') return '🖼️';
  if (mediaType === 'video') return '📹';
  if (mediaType === 'score') return '♪';
  return 'UNKNOWN';
}

function preload(arr) {
  for (var i = 0; i < arr.length; i++) {
    const media = arr[i].media;
    if (media && media.type === 'image') {
      preloadMedia(media);
    }
  }
}

function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

function sequencesToMarkdown(sequences) {
  let markdown = '';

  // Iterate over each sequence
  sequences.forEach((sequence, index) => {
    markdown += `\n\n### Sequence ${index + 1}\n\n`;
    markdown += '| Group | Note |\n';
    markdown += '|-------|------|\n';

    // Iterate over each item in the sequence
    sequence.forEach((item) => {
      markdown += `| ${item.group}     | ${item.note}   |\n`;
    });

    // Add spacing between tables
    if (index < sequences.length - 1) {
      markdown += '\n\n';
    }
  });

  return markdown;
}
