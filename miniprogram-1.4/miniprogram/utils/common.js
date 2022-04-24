function rad(d){
  return d * Math.PI / 180.0;
}

// 已知经纬度求两点间距离
function getDistance(lon1, lat1, lon2, lat2){
  var EARTH_RADIUS = 6378137;
  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var a = radLat1 - radLat2;
  var b = rad(lon1) - rad(lon2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2)+Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
  s = s * EARTH_RADIUS;
  return s;
}

function getDirection(lat1, lng1, lat2, lng2){
  var angle = getAngle(lat1, lng1, lat2, lng2);
  if((angle <= 10) || (angle > 350)){
    return '东';
  }
  else if((angle > 10) && (angle <= 80)){
    return '东北';
  }
  else if((angle > 80) && (angle <= 100)){
    return '北';
  }
  else if((angle > 100) && (angle <= 170)){
    return '西北';
  }
  else if((angle > 170) && (angle <= 190)){
    return '西';
  }
  else if((angle > 190) && (angle <= 260)){
    return '西南';
  }
  else if((angle > 260) && (angle <= 280)){
    return '南';
  }
  else if((angle > 280) && (angle <= 350)){
    return '东南';
  }
}

function getAngle(lng_a,lat_a, lng_b, lat_b){
  var a = (90 - lat_b) * Math.PI / 180;
  var b = (90 - lat_a) * Math.PI / 180;
  var AOC_BOC = (lng_b - lng_a) * Math.PI / 180;
  var cosc = Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(AOC_BOC);
  var sinc = Math.sqrt(1 - cosc * cosc);
  var sinA = Math.sin(a) * Math.sin(AOC_BOC) / sinc;
  var A = Math.asin(sinA) * 180 / Math.PI;
  var res = 0;
  if (lng_b > lng_a && lat_b > lat_a) res = A;
  else if (lng_b > lng_a && lat_b < lat_a) res = 180 - A;
  else if (lng_b < lng_a && lat_b < lat_a) res = 180 - A;
  else if (lng_b < lng_a && lat_b > lat_a) res = 360 + A;
  else if (lng_b > lng_a && lat_b == lat_a) res = 90;
  else if (lng_b < lng_a && lat_b == lat_a) res = 270;
  else if (lng_b == lng_a && lat_b > lat_a) res = 0;
  else if (lng_b == lng_a && lat_b < lat_a) res = 180;
  return res;
}

module:exports = {
  getDistance:getDistance,
  getDirection:getDirection
}