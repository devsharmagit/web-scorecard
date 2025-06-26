export  const getGrade = (score: number) => {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 55) return 'C-';
    if (score >= 50) return 'D+';
    if (score >= 45) return 'D';
    if (score >= 40) return 'D-';
    return 'F';
  };

export  const getRatingStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 50) return 'Good';
    return 'Needs Improvement';
  };

export   const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
      case 'A-':
        return 'text-green-600';
      case 'B+':
      case 'B':
      case 'B-':
        return 'text-blue-600';
      case 'C+':
      case 'C':
      case 'C-':
        return 'text-yellow-600';
      case 'D+':
      case 'D':
      case 'D-':
        return 'text-orange-600';
      default:
        return 'text-red-600';
    }
  };

export  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'text-green-600';
      case 'Good':
        return 'text-blue-600';
      default:
        return 'text-red-600';
    }
  };

export function getScoreColor(score : number) {
  let className = '';

  if (score <= 0.49) {
    className = 'text-[#f33]';
  } else if (score >= 0.5 && score <= 0.89) {
    className = 'text-[#fa3]';
  } else if (score >= 0.9) {
    className = 'text-[#00cc66]';
  }

  return className;
}


