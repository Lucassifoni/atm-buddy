# ATM Buddy Technical Guide

## Project Purpose

Mobile-friendly web application for Amateur Telescope Makers (ATMs) providing specialized calculators and reference tools. Designed to work offline after initial load.

## Technical Stack

- Vue 3 with Vue Router 4
- Vite 2 build tool
- Bulma 0.9.3 CSS framework
- SASS preprocessor
- GitHub Pages deployment

## Architecture

- Single-page application (SPA)
- Entry point: main.js
- App.vue for layout/navigation
- Component-based structure
- LocalStorage for persistence
- Client-side calculations

## Key Components

- BallSpherometer - ROC from spherometer measurements
- ReverseBallSpherometer - Calculate sagitta for desired ROC
- SineTableEquation - Angle for sine table testing
- BaaderMpcc - Conic constants for telescope mirrors
- SpraySilvering - Instructions and calculations for mirror silvering
- StigReminder - Astigmatism correction reference

## Build Process

- Built with Vite (`yarn build`)
- Deployment via build.sh to docs directory for GitHub Pages
