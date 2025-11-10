export default function AuthLayout({ title, children, footer }) {
  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <h2 className="text-center mb-4">{title}</h2>
                {children}
              </div>
              {footer && (
                <div className="card-footer bg-transparent text-center">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}