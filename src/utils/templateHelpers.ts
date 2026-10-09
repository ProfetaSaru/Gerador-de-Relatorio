import { NewCollaboratorFormData } from '../types/templates';

/**
 * Remove acentos e caracteres especiais para formato seguro de e-mail / slug
 */
export function sanitizeString(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Gera a sugestão de e-mail Benhub no formato: nome.ultimonome@benconsig.com
 */
export function generateBenhubEmail(fullName: string): string {
  if (!fullName.trim()) return '';

  const clean = sanitizeString(fullName);
  const parts = clean.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '';
  if (parts.length === 1) return `${parts[0]}@benconsig.com`;

  const firstName = parts[0];
  const lastName = parts[parts.length - 1];

  return `${firstName}.${lastName}@benconsig.com`;
}

/**
 * Capitaliza adequadamente o nome (ex: "julio cesar" -> "Julio Cesar")
 */
export function formatToTitleCase(name: string): string {
  const lowerWords = ['da', 'de', 'do', 'das', 'dos', 'e'];
  return name
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word, idx) => {
      if (idx > 0 && lowerWords.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Gera o texto final formatado exatamente de acordo com o padrão solicitado.
 */
export function buildNewCollaboratorText(data: NewCollaboratorFormData): string {
  const nomeMaiusculo = (data.fullName || 'NOME DO COLABORADOR').toUpperCase().trim();
  const setor = data.department.trim() || 'Setor';
  const periodo = data.period.trim() || 'xx:xx - xx:xx';

  const loginVanguard = data.vanguardLogin.trim();
  const senhaVanguard = data.vanguardPassword.trim();
  const linkVanguard = data.vanguardLink.trim() || 'https://gestao.sistemacorban.com.br/index.php/';

  const loginArgus = data.argusLogin.trim();
  const senhaArgus = data.argusPassword.trim();

  const nomeNormal = data.benhubName.trim() || data.fullName.trim() || 'Nome Normal';
  const emailBenhub = data.benhubEmail.trim() || 'nome.ultimonome@benconsig.com';
  const senhaBenhub = data.benhubPassword.trim() || 'senha';

  const equipe = data.team.trim() || 'Equipe';

  return `💙NOVO COLABORADOR(A): ${nomeMaiusculo} 💙
SETOR - ${setor}
Período: ${periodo}
LOGIN VANGUARD
Login: ${loginVanguard}
Senha: ${senhaVanguard}
Link:
${linkVanguard}
===============================
LOGIN ARGUS
Login: ${loginArgus}
Senha: ${senhaArgus}
LOGIN BENHUB
${nomeNormal}
| ${emailBenhub}
| ${senhaBenhub}
EQUIPE: ${equipe}.`;
}
