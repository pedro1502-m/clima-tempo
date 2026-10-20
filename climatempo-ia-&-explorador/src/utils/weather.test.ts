import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getWeatherConditionByCode,
  getAtmosphereTheme,
  getUvIndexInfo,
  getWindDirection,
  formatTimeFromIso,
  getDayNamePt,
} from './weather.ts';

test('getWeatherConditionByCode returns correct label and emojis for clear sky day vs night', () => {
  const dayCondition = getWeatherConditionByCode(0, 1);
  assert.equal(dayCondition.label, 'Céu limpo');
  assert.equal(dayCondition.emoji, '☀️');

  const nightCondition = getWeatherConditionByCode(0, 0);
  assert.equal(nightCondition.label, 'Céu estrelado');
  assert.equal(nightCondition.emoji, '🌙✨');
});

test('getWeatherConditionByCode handles rain and thunderstorm codes', () => {
  const rainCondition = getWeatherConditionByCode(63, 1);
  assert.equal(rainCondition.type, 'rain');
  assert.ok(rainCondition.label.includes('Chuva'));

  const stormCondition = getWeatherConditionByCode(95, 1);
  assert.equal(stormCondition.type, 'thunderstorm');
});

test('getAtmosphereTheme correctly detects rain, thunderstorm, sunset, dawn, and night', () => {
  // Rain priority
  assert.equal(getAtmosphereTheme({ weatherCode: 61, isDay: 1, localHour: 14 }), 'rain');
  // Thunderstorm priority
  assert.equal(getAtmosphereTheme({ weatherCode: 95, isDay: 1, localHour: 12 }), 'thunderstorm');
  // Dawn
  assert.equal(getAtmosphereTheme({ weatherCode: 0, isDay: 1, localHour: 6 }), 'dawn');
  // Sunset
  assert.equal(getAtmosphereTheme({ weatherCode: 0, isDay: 1, localHour: 18 }), 'sunset');
  // Night
  assert.equal(getAtmosphereTheme({ weatherCode: 0, isDay: 0, localHour: 22 }), 'night');
  // Day clear
  assert.equal(getAtmosphereTheme({ weatherCode: 0, isDay: 1, localHour: 12 }), 'day');
});

test('getUvIndexInfo returns expected categories', () => {
  assert.equal(getUvIndexInfo(1).label, 'Baixo');
  assert.equal(getUvIndexInfo(4).label, 'Moderado');
  assert.equal(getUvIndexInfo(7).label, 'Alto');
  assert.equal(getUvIndexInfo(9).label, 'Muito Alto');
  assert.equal(getUvIndexInfo(12).label, 'Extremo');
});

test('getWindDirection returns correct compass quadrant', () => {
  assert.equal(getWindDirection(0), 'N');
  assert.equal(getWindDirection(90), 'L');
  assert.equal(getWindDirection(180), 'S');
  assert.equal(getWindDirection(270), 'O');
});

test('formatTimeFromIso formats properly', () => {
  assert.equal(formatTimeFromIso('2026-10-20T14:30:00'), '14:30');
  assert.equal(formatTimeFromIso(''), '--:--');
});

test('getDayNamePt returns correct day name in Portuguese', () => {
  assert.equal(getDayNamePt('2026-10-18'), 'Domingo');
  assert.equal(getDayNamePt('2026-10-19'), 'Segunda');
  assert.equal(getDayNamePt('2026-10-20'), 'Terça');
});
