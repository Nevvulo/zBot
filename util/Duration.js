/**
MIT License

Copyright (c) 2017-2018 dirigeants

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

The following code is not attributed to the developer of zBot.
It was created by the Klasa organization, including bdistin and kyranet.
*/

class Duration {
	constructor(pattern) {
		this.offset = Duration._parse(pattern);
	}

	get fromNow() {
		return this.dateFrom(new Date());
	}

	dateFrom(date) {
		return new Date(date.getTime() + this.offset);
	}

	static _parse(pattern) {
		let result = 0;
		// ignore commas
		pattern = pattern.replace(/(\d),(\d)/g, '$1$2');
		pattern.replace(Duration.regex, (match, i, units) => {
			units = Duration[units] || Duration[units.toLowerCase().replace(/s$/, '')] || 1;
			result += parseFloat(i, 10) * units;
		});
		return result;
	}

	static toNow(earlier, showIn) {
		if (!(earlier instanceof Date)) earlier = new Date(earlier);
		const returnString = showIn ? 'in ' : '';
		let duration = (Date.now() - earlier) / 1000;

		// Compare the duration in seconds
		if (duration < 45) return `${returnString + Math.round(duration)} seconds`;
		else if (duration < 90) return `${returnString}a minute`;

		// Compare the duration in minutes
		duration /= 60;
		if (duration < 45) return `${returnString + Math.round(duration)} minutes`;
		else if (duration < 90) return `${returnString}an hour`;

		// Compare the duration in hours
		duration /= 60;
		if (duration < 22) return `${returnString + Math.round(duration)} hours`;
		else if (duration < 36) return `${returnString}a day`;

		// Compare the duration in days
		duration /= 24;
		if (duration < 26) return `${returnString + Math.round(duration)} days`;
		else if (duration < 46) return `${returnString}a month`;
		else if (duration < 320) return `${returnString + Math.round(duration / 30)} months`;
		else if (duration < 548) return `${returnString}a year`;

		return `${returnString + Math.round(duration / 365)} years`;
	}

  static fromNow(later, showIn) {
		if (!(later instanceof Date)) later = new Date(later);
		const returnString = showIn ? 'in ' : '';
		let duration = (later - Date.now()) / 1000;
		// Compare the duration in seconds
		if (duration < 45) return `${returnString + Math.round(duration)} seconds`;
		else if (duration < 90) return `${returnString}a minute`;

		// Compare the duration in minutes
		duration /= 60;
		if (duration < 45) return `${returnString + Math.round(duration)} minutes`;
		else if (duration < 90) return `${returnString}an hour`;

		// Compare the duration in hours
		duration /= 60;
		if (duration < 22) return `${returnString + Math.round(duration)} hours`;
		else if (duration < 36) return `${returnString}a day`;

		// Compare the duration in days
		duration /= 24;
		if (duration < 26) return `${returnString + Math.round(duration)} days`;
		else if (duration < 46) return `${returnString}a month`;
		else if (duration < 320) return `${returnString + Math.round(duration / 30)} months`;
		else if (duration < 548) return `${returnString}a year`;
		return `${returnString + Math.round(duration / 365)} years`;
	}

}
module.exports = Duration;

Duration.regex = /(-?\d*\.?\d+(?:e[-+]?\d+)?)\s*([a-zμ]*)/ig;
/**
 * conversion ratios
 */

Duration.nanosecond =
Duration.ns = 1 / 1e6;

Duration.microsecond =
Duration.μs = 1 / 1e3;

Duration.millisecond =
Duration.ms = 1;

Duration.second =
Duration.sec =
Duration.s = Duration.ms * 1000;

Duration.minute =
Duration.min =
Duration.m = Duration.s * 60;

Duration.hour =
Duration.hr =
Duration.h = Duration.m * 60;

Duration.day =
Duration.d = Duration.h * 24;

Duration.week =
Duration.wk =
Duration.w = Duration.d * 7;

Duration.month =
Duration.b = Duration.d * (365.25 / 12);

Duration.year =
Duration.yr =
Duration.y = Duration.d * 365.25;
