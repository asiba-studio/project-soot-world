import { ProjectWithMembers, ViewMode, ProjectPosition } from './types';



export const calculateLayout = (
    mode: ViewMode,
    projects: ProjectWithMembers[]
): ProjectPosition[] => {
    switch (mode) {
        case 'timeline':
            return calculateTimelineLayout(projects);
        case 'scatter':
            return calculateScatterLayout(projects);
        case 'network':
            return calculateNetworkLayout(projects);
        case 'geographic':
            return calculateGeographicLayout(projects);
        default:
            return calculateDefaultLayout(projects);
    }
};

const calculateDefaultLayout = (projects: ProjectWithMembers[]): ProjectPosition[] => {
    return projects.map(project => ({
        id: project.id,
        position: [
            (Math.random() - 0.5) * 20, // X: -10 から 10
            (Math.random() - 0.5) * 15, // Y: -7.5 から 7.5
            (Math.random() - 0.5) * 50  // Z: -25 から 25
        ]
    }));
};

const calculateTimelineLayout = (projects: ProjectWithMembers[]): ProjectPosition[] => {
    // 日付の範囲を取得
    const dates = projects.map(p => new Date(p.start_date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const dateRange = maxDate - minDate || 1; // ゼロ除算防止

    return projects.map(project => {
        const projectDate = new Date(project.start_date).getTime();
        // 日付を-50から50の範囲にマッピング
        const x = ((projectDate - minDate) / dateRange) * 20 - 10; // X軸: -10 to 10

        return {
            id: project.id,
            position: [
                x,
                (Math.random() - 0.5) * 15, // Y軸: -30 to 30
                (Math.random() - 0.5) * 50  // Z軸: -20 to 20
            ]
        };
    });
};

const calculateScatterLayout = (projects: ProjectWithMembers[]): ProjectPosition[] => {
    // exportされたclusterCentersを使用して統一
    // const clusterRadiusLocal = 20;
  
    return projects.map(project => {
      // カテゴリに対応するクラスタ中心を取得
      const center = clusterCenters[project.category] || clusterCenters['default'];
      
      return {
        id: project.id,
        position: [
          center[0] + (Math.random() - 0.5) * clusterRadius, // X軸: 中心 ± 10
          center[1] + (Math.random() - 0.5) * clusterRadius, // Y軸: 中心 ± 10
          center[2] + (Math.random() - 0.5) * 20                 // Z軸: 中心 ± 5
        ]
      };
    });
  };
  

// カテゴリごとの色を定義
export const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
        'スタジオ案件': '#ff6b6b',           // 赤系
        'ワークショップ案件': '#4ecdc4',      // 青緑系
        'トークセッション登壇': '#45b7d1',    // 青系
        'インキュベーション参加者によるプロジェクト': '#f9ca24', // 黄系
        'default': '#95a5a6'                 // グレー系
    };

    return colors[category] || colors['default'];
};

// カテゴリごとのクラスタ中心位置（再エクスポート用）
export const clusterCenters: { [key: string]: [number, number, number] } = {
    'スタジオ案件': [-15, 7, -10],
    'ワークショップ案件': [18, 12, 12],
    'トークセッション登壇': [-15, -25, 2],
    'インキュベーション参加者によるプロジェクト': [25, -15, -2],
    'default': [0, 0, -50]
};

// クラスタ半径（再エクスポート用）
export const clusterRadius = 20;



const calculateNetworkLayout = (projects: ProjectWithMembers[]): ProjectPosition[] => {
    // ネットワークレイアウトのロジック（関連度合いベース）
    return projects.map(project => ({
        id: project.id,
        position: [
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 40
        ]
    }));
};

const calculateGeographicLayout = (projects: ProjectWithMembers[]): ProjectPosition[] => {
    // 地理的レイアウトのロジック
    return projects.map(project => ({
        id: project.id,
        position: [
            (Math.random() - 0.5) * 90,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 30
        ]
    }));
};