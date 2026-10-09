import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Clock,
  User,
  Building,
  Users,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { NewCollaboratorFormData, PeriodShortcut } from '../../types/templates';
import {
  buildNewCollaboratorText,
  generateBenhubEmail,
  formatToTitleCase,
} from '../../utils/templateHelpers';
import { encryptDraft, decryptDraft } from '../../utils/cryptoUtils';

const DEFAULT_SHORTCUTS: PeriodShortcut[] = [
  { id: 'def-1', label: '08:00 - 17:00' },
  { id: 'def-2', label: '09:00 - 18:00' },
  { id: 'def-3', label: '08:00 - 18:00' },
];

const STORAGE_CUSTOM_PERIODS = 'autohub_custom_periods';
const STORAGE_ENCRYPTED_DRAFT = 'autohub_encrypted_draft_new_collab';

const INITIAL_FORM: NewCollaboratorFormData = {
  fullName: '',
  department: '',
  period: '08:00 - 17:00',
  vanguardLogin: '',
  vanguardPassword: '',
  vanguardLink: 'https://gestao.sistemacorban.com.br/index.php/',
  argusLogin: '',
  argusPassword: '',
  benhubName: '',
  benhubEmail: '',
  benhubPassword: '',
  team: '',
};

import { NotificationType } from '../../types/task';

interface Props {
  onNotify: (message: string, type?: NotificationType) => void;
}

export const NewCollaboratorTemplate: React.FC<Props> = ({ onNotify }) => {
  const [formData, setFormData] = useState<NewCollaboratorFormData>(INITIAL_FORM);
  const [hasCopied, setHasCopied] = useState(false);
  const [clearAfterCopy, setClearAfterCopy] = useState(false);

  // Visibilidade de senhas
  const [showVanguardPass, setShowVanguardPass] = useState(false);
  const [showArgusPass, setShowArgusPass] = useState(false);
  const [showBenhubPass, setShowBenhubPass] = useState(false);

  // Atalhos de período personalizados
  const [customShortcuts, setCustomShortcuts] = useState<PeriodShortcut[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_PERIODS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal de Criptografia
  const [cryptoModal, setCryptoModal] = useState<{
    isOpen: boolean;
    mode: 'save' | 'load';
  }>({ isOpen: false, mode: 'save' });
  const [cryptoPassword, setCryptoPassword] = useState('');
  const [isProcessingCrypto, setIsProcessingCrypto] = useState(false);
  const [hasStoredDraft, setHasStoredDraft] = useState<boolean>(() => {
    return !!localStorage.getItem(STORAGE_ENCRYPTED_DRAFT);
  });

  const allPeriodShortcuts = useMemo(() => {
    return [...DEFAULT_SHORTCUTS, ...customShortcuts];
  }, [customShortcuts]);

  // Atualiza campo com lógica inteligente para o nome
  const handleFieldChange = (field: keyof NewCollaboratorFormData, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      if (field === 'fullName') {
        // Se o nome normal do benhub estiver vazio ou sincronizado com o anterior, formata
        const titleCased = formatToTitleCase(value);
        next.benhubName = titleCased;
        next.benhubEmail = generateBenhubEmail(value);
      }

      return next;
    });
  };

  // Salvar novo atalho de período personalizado
  const handleSaveCurrentPeriodAsShortcut = () => {
    const trimmed = formData.period.trim();
    if (!trimmed) {
      onNotify('Digite um período antes de salvar.', 'error');
      return;
    }

    const alreadyExists = allPeriodShortcuts.some(
      (s) => s.label.toLowerCase() === trimmed.toLowerCase()
    );

    if (alreadyExists) {
      onNotify('Este atalho de período já está na lista.');
      return;
    }

    const newShortcut: PeriodShortcut = {
      id: `custom-${Date.now()}`,
      label: trimmed,
      isCustom: true,
    };

    const updated = [...customShortcuts, newShortcut];
    setCustomShortcuts(updated);
    try {
      localStorage.setItem(STORAGE_CUSTOM_PERIODS, JSON.stringify(updated));
      onNotify(`Atalho "${trimmed}" salvo com sucesso!`, 'success');
    } catch {
      onNotify('Erro ao salvar atalho localmente.', 'error');
    }
  };

  // Excluir atalho customizado
  const handleDeleteCustomShortcut = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = customShortcuts.filter((s) => s.id !== id);
    setCustomShortcuts(updated);
    try {
      localStorage.setItem(STORAGE_CUSTOM_PERIODS, JSON.stringify(updated));
      onNotify('Atalho removido.');
    } catch {
      // Ignore
    }
  };

  // Texto formatado gerado
  const generatedText = useMemo(() => {
    return buildNewCollaboratorText(formData);
  }, [formData]);

  // Ação de cópia
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setHasCopied(true);
      onNotify('Texto formatado copiado para a área de transferência!', 'success');
      setTimeout(() => setHasCopied(false), 2000);

      if (clearAfterCopy) {
        setFormData(INITIAL_FORM);
      }
    } catch {
      onNotify('Erro ao copiar texto. Verifique permissões do navegador.', 'error');
    }
  };

  const handleResetForm = () => {
    const confirmReset = window.confirm('Limpar todos os campos preenchidos?');
    if (confirmReset) {
      setFormData(INITIAL_FORM);
      onNotify('Formulário limpo.');
    }
  };

  // Criptografia: Salvar rascunho
  const handleExecuteSaveEncrypted = async () => {
    if (!cryptoPassword) {
      onNotify('Informe uma senha para proteger o rascunho.', 'error');
      return;
    }

    setIsProcessingCrypto(true);
    try {
      const encryptedJson = await encryptDraft(formData, cryptoPassword);
      localStorage.setItem(STORAGE_ENCRYPTED_DRAFT, encryptedJson);
      setHasStoredDraft(true);
      setCryptoModal({ isOpen: false, mode: 'save' });
      setCryptoPassword('');
      onNotify('Rascunho criptografado e salvo com sucesso!', 'success');
    } catch (err) {
      onNotify('Erro ao criptografar o rascunho.', 'error');
    } finally {
      setIsProcessingCrypto(false);
    }
  };

  // Criptografia: Carregar rascunho
  const handleExecuteLoadEncrypted = async () => {
    if (!cryptoPassword) {
      onNotify('Informe a senha para decriptografar.', 'error');
      return;
    }

    const stored = localStorage.getItem(STORAGE_ENCRYPTED_DRAFT);
    if (!stored) {
      onNotify('Nenhum rascunho salvo encontrado.', 'error');
      return;
    }

    setIsProcessingCrypto(true);
    try {
      const result = await decryptDraft(stored, cryptoPassword);
      setFormData(result.data);
      setCryptoModal({ isOpen: false, mode: 'load' });
      setCryptoPassword('');

      if (result.isCorrupted) {
        onNotify(
          'Aviso: Senha incorreta utilizada! Os dados foram decriptografados com erro/ruído.',
          'error'
        );
      } else {
        onNotify('Rascunho decriptografado e carregado com sucesso!', 'success');
      }
    } catch (err) {
      onNotify('Erro ao processar decriptação.', 'error');
    } finally {
      setIsProcessingCrypto(false);
    }
  };

  // Apagar rascunho salvo
  const handleDeleteDraft = () => {
    const confirmDelete = window.confirm('Deseja excluir o rascunho criptografado salvo?');
    if (confirmDelete) {
      localStorage.removeItem(STORAGE_ENCRYPTED_DRAFT);
      setHasStoredDraft(false);
      onNotify('Rascunho criptografado excluído.');
    }
  };

  return (
    <div className="template-workspace-grid">
      {/* Formulário de Edição */}
      <div className="template-form-card">
        {/* Bloco de Rascunho Seguro com Criptografia */}
        <div className="draft-security-card">
          <div className="draft-security-header">
            <span className="draft-security-title">
              <Lock size={15} /> Proteção de Rascunho Criptografado
            </span>
            {hasStoredDraft ? (
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                ● Rascunho salvo no navegador
              </span>
            ) : (
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Nenhum rascunho salvo
              </span>
            )}
          </div>
          <div className="draft-security-actions">
            <button
              type="button"
              className="btn-draft-action save"
              onClick={() => {
                setCryptoPassword('');
                setCryptoModal({ isOpen: true, mode: 'save' });
              }}
              title="Salvar campos protegidos por senha"
            >
              <KeyRound size={13} /> Salvar Rascunho com Senha
            </button>

            {hasStoredDraft && (
              <>
                <button
                  type="button"
                  className="btn-draft-action load"
                  onClick={() => {
                    setCryptoPassword('');
                    setCryptoModal({ isOpen: true, mode: 'load' });
                  }}
                  title="Decriptografar com senha"
                >
                  <Unlock size={13} /> Carregar Rascunho
                </button>
                <button
                  type="button"
                  className="btn-draft-action delete"
                  onClick={handleDeleteDraft}
                  title="Excluir rascunho do navegador"
                >
                  <Trash2 size={13} /> Excluir
                </button>
              </>
            )}
          </div>
        </div>

        {/* 1. Dados Básicos do Colaborador */}
        <div className="field-group">
          <div className="form-section-title">
            <User size={18} /> Dados Gerais do Colaborador
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="field-fullName">
              <span>Nome Completo do Colaborador *</span>
              <span className="field-hint">Gera o título em maiúsculas e e-mail</span>
            </label>
            <input
              id="field-fullName"
              className="field-input"
              type="text"
              placeholder="Ex: Amanda Silva Santos"
              value={formData.fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label" htmlFor="field-dept">
                <span><Building size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Setor *</span>
              </label>
              <input
                id="field-dept"
                className="field-input"
                type="text"
                placeholder="Ex: Operações, Comercial"
                value={formData.department}
                onChange={(e) => handleFieldChange('department', e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="field-team">
                <span><Users size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Equipe *</span>
              </label>
              <input
                id="field-team"
                className="field-input"
                type="text"
                placeholder="Ex: Alpha, Suporte, Matriz"
                value={formData.team}
                onChange={(e) => handleFieldChange('team', e.target.value)}
              />
            </div>
          </div>

          {/* Período e Atalhos Personalizados */}
          <div className="field-group" style={{ marginTop: '0.5rem' }}>
            <label className="field-label" htmlFor="field-period">
              <span><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Período de Trabalho *</span>
              <span className="field-hint">Formato xx:xx - xx:xx</span>
            </label>
            <input
              id="field-period"
              className="field-input"
              type="text"
              placeholder="Ex: 08:00 - 17:00"
              value={formData.period}
              onChange={(e) => handleFieldChange('period', e.target.value)}
            />

            <div className="period-shortcuts-wrapper">
              <div className="period-chips-list">
                {allPeriodShortcuts.map((shortcut) => {
                  const isActive = formData.period === shortcut.label;
                  return (
                    <button
                      key={shortcut.id}
                      type="button"
                      className={`period-chip ${isActive ? 'active' : ''}`}
                      onClick={() => handleFieldChange('period', shortcut.label)}
                    >
                      {shortcut.label}
                      {shortcut.isCustom && (
                        <span
                          className="period-chip-remove"
                          onClick={(e) => handleDeleteCustomShortcut(e, shortcut.id)}
                          title="Excluir este atalho personalizado"
                        >
                          ×
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="add-period-btn"
                onClick={handleSaveCurrentPeriodAsShortcut}
              >
                <Plus size={13} /> Salvar período atual como atalho
              </button>
            </div>
          </div>
        </div>

        {/* 2. Login Vanguard */}
        <div className="credential-block">
          <div className="credential-block-header">
            <span className="credential-badge vanguard">Login Vanguard</span>
            <a
              href={formData.vanguardLink}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.75rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 3 }}
            >
              Abrir link <ExternalLink size={12} />
            </a>
          </div>

          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label" htmlFor="field-vg-login">Login Vanguard</label>
              <input
                id="field-vg-login"
                className="field-input"
                type="text"
                placeholder="Usuário Vanguard"
                value={formData.vanguardLogin}
                onChange={(e) => handleFieldChange('vanguardLogin', e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="field-vg-pass">Senha Vanguard</label>
              <div className="field-input-wrapper">
                <input
                  id="field-vg-pass"
                  className="field-input has-icon-right"
                  type={showVanguardPass ? 'text' : 'password'}
                  placeholder="Senha"
                  value={formData.vanguardPassword}
                  onChange={(e) => handleFieldChange('vanguardPassword', e.target.value)}
                />
                <button
                  type="button"
                  className="field-icon-btn"
                  onClick={() => setShowVanguardPass((prev) => !prev)}
                  title={showVanguardPass ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showVanguardPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="field-vg-link">Link do Sistema Vanguard</label>
            <input
              id="field-vg-link"
              className="field-input"
              type="text"
              value={formData.vanguardLink}
              onChange={(e) => handleFieldChange('vanguardLink', e.target.value)}
            />
          </div>
        </div>

        {/* 3. Login Argus */}
        <div className="credential-block">
          <div className="credential-block-header">
            <span className="credential-badge argus">Login Argus</span>
          </div>

          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label" htmlFor="field-argus-login">Login Argus</label>
              <input
                id="field-argus-login"
                className="field-input"
                type="text"
                placeholder="Usuário Argus"
                value={formData.argusLogin}
                onChange={(e) => handleFieldChange('argusLogin', e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="field-argus-pass">Senha Argus</label>
              <div className="field-input-wrapper">
                <input
                  id="field-argus-pass"
                  className="field-input has-icon-right"
                  type={showArgusPass ? 'text' : 'password'}
                  placeholder="Senha"
                  value={formData.argusPassword}
                  onChange={(e) => handleFieldChange('argusPassword', e.target.value)}
                />
                <button
                  type="button"
                  className="field-icon-btn"
                  onClick={() => setShowArgusPass((prev) => !prev)}
                  title={showArgusPass ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showArgusPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Login Benhub */}
        <div className="credential-block">
          <div className="credential-block-header">
            <span className="credential-badge benhub">Login Benhub</span>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="field-bh-name">
              <span>Nome Normal</span>
              <span className="field-hint">Preenchido automaticamente a partir do nome</span>
            </label>
            <input
              id="field-bh-name"
              className="field-input"
              type="text"
              placeholder="Ex: Amanda Silva Santos"
              value={formData.benhubName}
              onChange={(e) => handleFieldChange('benhubName', e.target.value)}
            />
          </div>

          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label" htmlFor="field-bh-email">
                <span>E-mail Corporativo (@benconsig.com)</span>
              </label>
              <input
                id="field-bh-email"
                className="field-input"
                type="email"
                placeholder="nome.ultimonome@benconsig.com"
                value={formData.benhubEmail}
                onChange={(e) => handleFieldChange('benhubEmail', e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="field-bh-pass">Senha Benhub</label>
              <div className="field-input-wrapper">
                <input
                  id="field-bh-pass"
                  className="field-input has-icon-right"
                  type={showBenhubPass ? 'text' : 'password'}
                  placeholder="Senha"
                  value={formData.benhubPassword}
                  onChange={(e) => handleFieldChange('benhubPassword', e.target.value)}
                />
                <button
                  type="button"
                  className="field-icon-btn"
                  onClick={() => setShowBenhubPass((prev) => !prev)}
                  title={showBenhubPass ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showBenhubPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Painel Lateral: Pré-visualização ao vivo */}
      <div className="template-preview-card">
        <div className="preview-header">
          <div className="preview-header-title">
            <span>Pré-visualização do Texto</span>
          </div>
          <span className="preview-header-badge">Pronto para Enviar</span>
        </div>

        <div className="preview-content-box" id="template-output-preview">
          {generatedText}
        </div>

        <div className="preview-footer">
          <div className="preview-actions">
            <button
              type="button"
              className={`btn-copy-template ${hasCopied ? 'copied' : ''}`}
              onClick={handleCopyText}
            >
              {hasCopied ? <Check size={18} /> : <Copy size={18} />}
              {hasCopied ? 'Copiado para Área de Transferência!' : 'Copiar Texto'}
            </button>

            <button
              type="button"
              className="btn-clear-template"
              onClick={handleResetForm}
              title="Limpar formulário"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#94a3b8', cursor: 'pointer', marginTop: '0.25rem' }}>
            <input
              type="checkbox"
              checked={clearAfterCopy}
              onChange={(e) => setClearAfterCopy(e.target.checked)}
            />
            Limpar campos automaticamente após copiar
          </label>
        </div>
      </div>

      {/* Modal de Senha Mestre para Criptografia */}
      {cryptoModal.isOpen && (
        <div className="crypto-modal-backdrop">
          <div className="crypto-modal-box">
            <div className="crypto-modal-header">
              <h3>
                {cryptoModal.mode === 'save' ? <Lock size={18} /> : <Unlock size={18} />}
                {cryptoModal.mode === 'save'
                  ? 'Proteger Rascunho com Senha'
                  : 'Decriptografar Rascunho'}
              </h3>
            </div>

            <div className="crypto-modal-body">
              <p className="crypto-modal-desc">
                {cryptoModal.mode === 'save'
                  ? 'Digite uma senha mestre para criptografar este rascunho com AES-CTR. Somente quem possuir esta senha conseguirá restaurar os dados corretamente.'
                  : 'Digite a senha mestre usada na proteção. Nota: Se a senha digitada estiver errada, os dados serão decriptografados com caracteres corrompidos/ruído.'}
              </p>

              <div className="field-group">
                <label className="field-label" htmlFor="crypto-master-pass">
                  Senha Mestre de Criptografia
                </label>
                <input
                  id="crypto-master-pass"
                  className="field-input"
                  type="password"
                  placeholder="Digite sua senha..."
                  value={cryptoPassword}
                  onChange={(e) => setCryptoPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      cryptoModal.mode === 'save'
                        ? handleExecuteSaveEncrypted()
                        : handleExecuteLoadEncrypted();
                    }
                  }}
                  autoFocus
                />
              </div>

              {cryptoModal.mode === 'load' && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', color: '#b45309', background: '#fffbeb', padding: '0.6rem', borderRadius: 8 }}>
                  <ShieldAlert size={16} />
                  <span>A decriptação com senha errada gerará valores corrompidos nos campos.</span>
                </div>
              )}
            </div>

            <div className="crypto-modal-footer">
              <button
                type="button"
                className="btn-clear-template"
                style={{ color: 'var(--ink)' }}
                onClick={() => setCryptoModal({ isOpen: false, mode: 'save' })}
                disabled={isProcessingCrypto}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-draft-action save"
                onClick={
                  cryptoModal.mode === 'save'
                    ? handleExecuteSaveEncrypted
                    : handleExecuteLoadEncrypted
                }
                disabled={isProcessingCrypto}
              >
                {isProcessingCrypto
                  ? 'Processando...'
                  : cryptoModal.mode === 'save'
                  ? 'Criptografar e Salvar'
                  : 'Decriptografar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
