import { BadRequestException } from '@nestjs/common';

export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function validateDecimalPrecision(
  value: number,
  maxDecimals: number = 2,
): void {
  const decimalPart = value.toString().split('.')[1];
  if (decimalPart && decimalPart.length > maxDecimals) {
    throw new BadRequestException(
      `Amount must have at most ${maxDecimals} decimal places`,
    );
  }
}

export function normalizeAmount(amount: number): number {
  validateDecimalPrecision(amount);
  return roundToTwoDecimals(amount);
}

