import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-wrapper">
      <!-- Animated Background Mesh Orbs -->
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
      <div class="bg-orb orb-3"></div>
      
      <!-- Main Glass Card Container -->
      <div class="auth-card-container">
        <!-- Left Brand Panel -->
        <div class="brand-panel">
          <div class="brand-header">
            <div class="logo-box">
              <span class="logo-icon">🎓</span>
            </div>
            <div class="brand-title-group">
              <h1 class="brand-name">OBE-MS</h1>
              <span class="brand-badge">Enterprise Edition</span>
            </div>
          </div>

          <div class="brand-content">
            <h2 class="hero-headline">Outcome-Based Education Management Platform</h2>
            <p class="hero-subtext">Empowering universities with automated outcome tracking, accreditation compliance, and intelligent learning analytics.</p>

            <ul class="feature-list">
              <li>
                <span class="check-icon">✓</span>
                <span>Automated CO-PO Attainment Calculation</span>
              </li>
              <li>
                <span class="check-icon">✓</span>
                <span>Multi-Tenant Role Based Access Control</span>
              </li>
              <li>
                <span class="check-icon">✓</span>
                <span>Real-Time Accreditation Evidence Reports</span>
              </li>
            </ul>
          </div>

          <div class="brand-footer">
            <div class="status-indicator">
              <span class="pulse-dot"></span>
              <span class="status-text">System Status: Operational</span>
            </div>
          </div>
        </div>

        <!-- Right Form View Container -->
        <div class="form-panel">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap');

    .auth-wrapper {
      position: relative;
      min-height: 100vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #060b19;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      padding: 1.5rem;
      box-sizing: border-box;
    }

    /* Background Orbs */
    .bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.45;
      pointer-events: none;
      animation: float 14s infinite alternate ease-in-out;
    }
    .orb-1 {
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, #6366f1 0%, #3b82f6 100%);
      top: -10%;
      left: -5%;
    }
    .orb-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, #8b5cf6 0%, #ec4899 100%);
      bottom: -15%;
      right: -5%;
      animation-delay: -5s;
    }
    .orb-3 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, #06b6d4 0%, #3b82f6 100%);
      top: 40%;
      left: 45%;
      animation-delay: -8s;
    }

    @keyframes float {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(40px, -30px) scale(1.08); }
      100% { transform: translate(-30px, 40px) scale(0.95); }
    }

    /* Card Layout */
    .auth-card-container {
      position: relative;
      z-index: 10;
      display: flex;
      width: 100%;
      max-width: 1020px;
      min-height: 600px;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7),
                  0 0 40px rgba(99, 102, 241, 0.15);
      overflow: hidden;
    }

    /* Left Brand Panel */
    .brand-panel {
      flex: 1.1;
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%);
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      padding: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }

    .brand-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .logo-box {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
    }
    .brand-title-group {
      display: flex;
      flex-direction: column;
    }
    .brand-name {
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-badge {
      font-size: 0.72rem;
      font-weight: 700;
      color: #818cf8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .hero-headline {
      font-family: 'Outfit', sans-serif;
      font-size: 1.85rem;
      font-weight: 700;
      color: #f8fafc;
      line-height: 1.3;
      margin: 2rem 0 1rem 0;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtext {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .feature-list li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #e2e8f0;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .check-icon {
      width: 22px;
      height: 22px;
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #818cf8;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 800;
    }

    .brand-footer {
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .status-text {
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 600;
    }

    /* Right Form Panel */
    .form-panel {
      flex: 1;
      padding: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: rgba(15, 23, 42, 0.4);
    }

    @media (max-width: 850px) {
      .auth-card-container {
        flex-direction: column;
        max-width: 480px;
      }
      .brand-panel {
        padding: 2rem;
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .hero-headline {
        font-size: 1.4rem;
      }
      .feature-list {
        display: none;
      }
      .form-panel {
        padding: 2rem;
      }
    }
  `]
})
export class AuthLayoutComponent {}

