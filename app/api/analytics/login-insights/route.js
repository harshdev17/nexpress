import { NextResponse } from 'next/server';
import { user_db } from '@/lib/db';
import { validateSession } from '@/lib/session';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get('sessionToken');
    const period = searchParams.get('period') || '7'; // days

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Session token is required' },
        { status: 400 }
      );
    }

    // Validate session first
    const sessionData = await validateSession(sessionToken);
    
    if (!sessionData) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const userId = sessionData.userId;
    const days = parseInt(period);

    // Get login statistics
    const [loginStats] = await user_db.promise().query(`
      SELECT 
        COUNT(*) as total_logins,
        COUNT(DISTINCT DATE(login_date)) as unique_days,
        AVG(login_time_ms) as avg_login_time,
        COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_risk_logins,
        COUNT(CASE WHEN is_new_device = 1 THEN 1 END) as new_device_logins,
        COUNT(CASE WHEN is_new_location = 1 THEN 1 END) as new_location_logins
      FROM login_analytics 
      WHERE user_id = ? AND login_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    `, [userId, days]);

    // Get device breakdown
    const [deviceStats] = await user_db.promise().query(`
      SELECT 
        device_type,
        browser_name,
        os_name,
        COUNT(*) as login_count,
        AVG(login_time_ms) as avg_login_time
      FROM login_analytics 
      WHERE user_id = ? AND login_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY device_type, browser_name, os_name
      ORDER BY login_count DESC
    `, [userId, days]);

    // Get location breakdown
    const [locationStats] = await user_db.promise().query(`
      SELECT 
        country,
        city,
        COUNT(*) as login_count,
        COUNT(DISTINCT ip_address) as unique_ips
      FROM login_analytics 
      WHERE user_id = ? AND login_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY country, city
      ORDER BY login_count DESC
    `, [userId, days]);

    // Get hourly login patterns
    const [hourlyStats] = await user_db.promise().query(`
      SELECT 
        login_hour,
        COUNT(*) as login_count
      FROM login_analytics 
      WHERE user_id = ? AND login_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY login_hour
      ORDER BY login_hour
    `, [userId, days]);

    // Get daily login trends
    const [dailyStats] = await user_db.promise().query(`
      SELECT 
        login_date,
        COUNT(*) as login_count,
        AVG(login_time_ms) as avg_login_time
      FROM login_analytics 
      WHERE user_id = ? AND login_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY login_date
      ORDER BY login_date DESC
    `, [userId, days]);

    // Get security events
    const [securityEvents] = await user_db.promise().query(`
      SELECT 
        event_type,
        event_severity,
        COUNT(*) as event_count,
        MAX(created_at) as last_occurrence
      FROM security_events 
      WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY event_type, event_severity
      ORDER BY event_count DESC
    `, [userId, days]);

    return NextResponse.json({
      success: true,
      message: 'Login insights retrieved successfully',
      period: `${days} days`,
      insights: {
        overview: loginStats[0],
        devices: deviceStats,
        locations: locationStats,
        hourlyPatterns: hourlyStats,
        dailyTrends: dailyStats,
        securityEvents: securityEvents
      }
    });

  } catch (error) {
    console.error('Login insights error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve login insights' },
      { status: 500 }
    );
  }
}
